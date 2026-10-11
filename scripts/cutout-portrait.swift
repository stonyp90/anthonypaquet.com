// Offline asset preparation (macOS 14+). Writes the photograph with a subject-only alpha
// channel, ready for prepare-portrait-mask.mjs. RGB pixels are copied, never repainted.
//
// Usage: swift scripts/cutout-portrait.swift <photo> <cutout.png> [instance]
// Without [instance], the largest foreground instance (the person) is kept.
import CoreImage
import Foundation
import Vision

let arguments = CommandLine.arguments
guard arguments.count >= 3 else {
  FileHandle.standardError.write(Data("Required arguments: <photo> <cutout.png> [instance]\n".utf8))
  exit(64)
}
guard let photo = CIImage(contentsOf: URL(fileURLWithPath: arguments[1])) else {
  FileHandle.standardError.write(Data("Cannot decode \(arguments[1])\n".utf8))
  exit(66)
}

let handler = VNImageRequestHandler(ciImage: photo)
// Subject lifting runs on the Neural Engine only, so this needs a session that can reach it.
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let observation = request.results?.first else {
  FileHandle.standardError.write(Data("No foreground subject found\n".utf8))
  exit(65)
}

let context = CIContext(options: [.workingColorSpace: NSNull()])

func mask(for instance: Int) throws -> CIImage {
  CIImage(cvPixelBuffer: try observation.generateScaledMaskForImage(forInstances: IndexSet(integer: instance), from: handler))
}

func coverage(of image: CIImage) -> Double {
  var pixel = [UInt8](repeating: 0, count: 4)
  let average = image.applyingFilter("CIAreaAverage", parameters: [kCIInputExtentKey: CIVector(cgRect: image.extent)])
  context.render(average, toBitmap: &pixel, rowBytes: 4, bounds: CGRect(x: 0, y: 0, width: 1, height: 1), format: .RGBA8, colorSpace: nil)
  return Double(pixel[0]) / 255
}

var instance = arguments.count > 3 ? Int(arguments[3]) : nil
if instance == nil {
  var largest = 0.0
  for candidate in observation.allInstances {
    let share = coverage(of: try mask(for: candidate))
    print("instance \(candidate): \(String(format: "%.1f", share * 100)) % of the frame")
    if share > largest {
      largest = share
      instance = candidate
    }
  }
}
guard let kept = instance, observation.allInstances.contains(kept) else {
  FileHandle.standardError.write(Data("Instance not found; available: \(Array(observation.allInstances))\n".utf8))
  exit(65)
}

let alpha = try mask(for: kept)
let cutout = photo.applyingFilter("CIBlendWithMask", parameters: [
  kCIInputBackgroundImageKey: CIImage.empty(),
  kCIInputMaskImageKey: alpha,
])
try context.writePNGRepresentation(of: cutout, to: URL(fileURLWithPath: arguments[2]), format: .RGBA8, colorSpace: photo.colorSpace ?? CGColorSpace(name: CGColorSpace.sRGB)!)
print("Kept instance \(kept): \(arguments[2]) (\(Int(photo.extent.width))×\(Int(photo.extent.height)))")
